import { GraphQLClient } from 'graphql-request';
import { Client, cacheExchange, fetchExchange, ssrExchange } from 'urql';
import { registerUrql } from '@urql/next/rsc';
import Cookies from 'js-cookie';

const isCorporateChannel = Cookies.get('isCorporateChannel');
export interface ClientConfig {
  endpoint?: string;
  headers?: Record<string, string>;
  cache?: 'default' | 'force-cache';
  revalidate?: number | false;
  token?: string;
}

export const ClientPresets = {
  DEFAULT: 'default',
  NO_CACHE: 'no-cache',
  LOYALTY: 'loyalty',
  WORDPRESS: 'wordpress', // For WordPress/CMS queries
} as const;

export type ClientPreset = (typeof ClientPresets)[keyof typeof ClientPresets];

export const ClientType = {
  GRAPHQL: 'graphql', // For server-side GraphQL requests
  URQL: 'urql', // For client-side React queries with hooks
} as const;

export type ClientTypeValue = (typeof ClientType)[keyof typeof ClientType];

class GraphQLClientManager {
  private static instance: GraphQLClientManager;
  private clients: Map<string, GraphQLClient> = new Map();

  private readonly endpoints = {
    main: process.env.GRAPHQL_URL as string,
    homepage: process.env.NEXT_PUBLIC_LOYALTY_GRAPHQL_URL as string,
    loyalty: (process.env.NEXT_PUBLIC_LOYALTY_GRAPHQL_URL ||
      process.env.GRAPHQL_URL) as string,
    wordpress: process.env.WP_GRAPHQL_URL as string,
  };

  private readonly defaultHeaders = {
    'Channel-Id': isCorporateChannel
      ? isCorporateChannel
      : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
    'Content-Type': 'application/json',
  };

  private constructor() {}

  static getInstance(): GraphQLClientManager {
    if (!GraphQLClientManager.instance) {
      GraphQLClientManager.instance = new GraphQLClientManager();
    }
    return GraphQLClientManager.instance;
  }

  private createFetch(config: ClientConfig): typeof fetch {
    return async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const fetchOptions: RequestInit = { ...init };

      if (config.revalidate !== undefined) {
        fetchOptions.next = { revalidate: config.revalidate };
      }

      return fetch(input, fetchOptions);
    };
  }

  private createClient(config: ClientConfig): GraphQLClient {
    const endpoint = config.endpoint || this.endpoints.main;

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...config.headers,
    };

    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    return new GraphQLClient(endpoint, {
      headers,
      fetch: this.createFetch(config),
    });
  }

  getClient(
    preset: ClientPreset,
    additionalConfig?: Partial<ClientConfig>
  ): GraphQLClient {
    const cacheKey = `${preset}-${JSON.stringify(additionalConfig || {})}`;

    if (this.clients.has(cacheKey)) {
      return this.clients.get(cacheKey)!;
    }

    let config: ClientConfig;

    switch (preset) {
      case ClientPresets.NO_CACHE:
        config = {
          endpoint: this.endpoints.homepage,
          ...additionalConfig,
        };
        break;

      case ClientPresets.LOYALTY:
        config = {
          endpoint: this.endpoints.loyalty,
          ...additionalConfig,
        };
        break;

      case ClientPresets.WORDPRESS:
        config = {
          endpoint: this.endpoints.wordpress,
          ...additionalConfig,
        };
        break;

      case ClientPresets.DEFAULT:
      default:
        config = {
          endpoint: this.endpoints.main,
          ...additionalConfig,
        };
        break;
    }

    const client = this.createClient(config);
    this.clients.set(cacheKey, client);
    return client;
  }

  getCustomClient(config: ClientConfig): GraphQLClient {
    return this.createClient(config);
  }

  async request<T = any>(
    preset: ClientPreset,
    query: string,
    variables?: any,
    additionalConfig?: Partial<ClientConfig>
  ): Promise<T> {
    const client = this.getClient(preset, additionalConfig);

    try {
      return await client.request<T>(query, variables);
    } catch (error) {
      console.error(`GraphQL ${preset} Request Error:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.clients.clear();
  }
}

class URQLClientManager {
  private static instance: URQLClientManager;
  private mainClient: Client;
  private loyaltyClient: Client;
  private ssrCache: ReturnType<typeof ssrExchange>;

  private readonly endpoints = {
    main: process.env.GRAPHQL_URL as string,
    loyalty: (process.env.NEXT_PUBLIC_LOYALTY_GRAPHQL_URL ||
      process.env.GRAPHQL_URL) as string,
  };

  private constructor() {
    const isServerSide = typeof window === 'undefined';
    this.ssrCache = ssrExchange({ isClient: !isServerSide });

    // Create main URQL client
    this.mainClient = this.createURQLClient(this.endpoints.main);

    // Create loyalty URQL client
    this.loyaltyClient = this.createURQLClient(this.endpoints.loyalty);
  }

  static getInstance(): URQLClientManager {
    if (!URQLClientManager.instance) {
      URQLClientManager.instance = new URQLClientManager();
    }
    return URQLClientManager.instance;
  }

  private createURQLClient(endpoint: string): Client {
    return new Client({
      url: endpoint || '',
      exchanges: [cacheExchange, this.ssrCache, fetchExchange],
      preferGetMethod: false,
      fetchOptions: () => {
        const token =
          typeof window !== 'undefined' ? Cookies.get('accessToken') : null;
        return {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Channel-Id': isCorporateChannel
              ? isCorporateChannel
              : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
            ...(token && { authorization: `Bearer ${token}` }),
          },
        };
      },
    });
  }

  getMainClient(): Client {
    return this.mainClient;
  }

  getLoyaltyClient(): Client {
    return this.loyaltyClient;
  }

  getSSRCache() {
    return this.ssrCache;
  }
}

export const graphqlClientManager = GraphQLClientManager.getInstance();

export const urqlClientManager = URQLClientManager.getInstance();

export const serverClient = graphqlClientManager.getClient(
  ClientPresets.DEFAULT
);
export const noCacheClient = graphqlClientManager.getClient(
  ClientPresets.NO_CACHE
);
export const wordpressClient = graphqlClientManager.getClient(
  ClientPresets.WORDPRESS
);

export const urqlClient = urqlClientManager.getMainClient();
export const urqlLoyaltyClient = urqlClientManager.getLoyaltyClient();
export const ssrCache = urqlClientManager.getSSRCache();

const { getClient } = registerUrql(() => urqlClient);
export { getClient };

export default urqlClient;

export async function serverRequest<T = any>(
  query: string,
  variables?: any,
  token?: string
): Promise<T> {
  return graphqlClientManager.request<T>(
    ClientPresets.DEFAULT,
    query,
    variables,
    token ? { token } : undefined
  );
}

export async function noCacheRequest<T = any>(
  query: string,
  variables?: any,
  token?: string
): Promise<T> {
  return graphqlClientManager.request<T>(
    ClientPresets.NO_CACHE,
    query,
    variables,
    token ? { token } : undefined
  );
}

export async function urqlRequest<T = any>(
  query: string,
  variables?: any,
  useLoyalty = false
): Promise<T> {
  const client = useLoyalty ? urqlLoyaltyClient : urqlClient;

  try {
    const result = await client.query(query, variables).toPromise();

    if (result.error) {
      throw result.error;
    }

    return result.data as T;
  } catch (error) {
    console.error('URQL Request Error:', error);
    throw error;
  }
}

export async function urqlMutation<T = any>(
  mutation: string,
  variables?: any,
  useLoyalty = false
): Promise<T> {
  const client = useLoyalty ? urqlLoyaltyClient : urqlClient;

  try {
    const result = await client.mutation(mutation, variables).toPromise();

    if (result.error) {
      throw result.error;
    }

    return result.data as T;
  } catch (error) {
    console.error('URQL Mutation Error:', error);
    throw error;
  }
}
