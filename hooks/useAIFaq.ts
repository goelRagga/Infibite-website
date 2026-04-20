import { askAIQuestion } from '@/lib/api/ai';
import {
  SUGGESTED_QUESTIONS,
  AI_CHAT_MESSAGES,
  MESSAGE_TYPE,
} from '@/lib/constants';

// Re-export MESSAGE_TYPE for backwards compatibility
export { MESSAGE_TYPE };
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  useRegistrationFlow,
  createAIMessage,
  RegistrationStep,
  UserInfo,
} from './useRegistrationFlow';
import { useUserContext } from '@/contexts/SharedProvider';
import { useLoggedInUser } from './useLoggedInUser';
import { useLeadCapture } from './useLeadCapture';

export interface ChatMessage {
  id: string;
  type: MESSAGE_TYPE;
  content: string;
  timestamp: Date;
  suggestions?: string[];
  couponCode?: string;
}

export type LoadingPhase =
  | 'analyzing'
  | 'understanding'
  | 'searching'
  | 'gathering'
  | 'drafting'
  | 'polishing'
  | 'finalizing';

// Loading phase transition timings (in milliseconds)
const LOADING_PHASE_TIMINGS: { phase: LoadingPhase; delay: number }[] = [
  { phase: 'understanding', delay: 2500 },
  { phase: 'searching', delay: 7500 },
  { phase: 'gathering', delay: 10000 },
  { phase: 'drafting', delay: 15000 },
  { phase: 'polishing', delay: 20000 },
  { phase: 'finalizing', delay: 25000 },
];

// Helper to start loading phase timers
const startLoadingPhaseTimers = (
  setLoadingPhase: (phase: LoadingPhase) => void,
  timersRef: React.MutableRefObject<number[]>
) => {
  // Clear existing timers
  timersRef.current.forEach((id) => window.clearTimeout(id));
  timersRef.current = [];

  // Set up new timers
  LOADING_PHASE_TIMINGS.forEach(({ phase, delay }) => {
    timersRef.current.push(
      window.setTimeout(() => setLoadingPhase(phase), delay)
    );
  });
};

// Helper to clear loading phase timers
const clearLoadingPhaseTimers = (
  timersRef: React.MutableRefObject<number[]>
) => {
  timersRef.current.forEach((id) => window.clearTimeout(id));
  timersRef.current = [];
};

export type { RegistrationStep, UserInfo };

interface UseAIFaqProps {
  propertyId: string;
}

interface UseAIFaqReturn {
  question: string;
  setQuestion: (value: string) => void;
  isLoading: boolean;
  loadingPhase: LoadingPhase | null;
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleSendMessage: (message?: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isRegistered: boolean;
  userInfo: UserInfo;
  handleFormSubmit: (data: {
    name: string;
    phone: string;
    countryCode: string;
  }) => Promise<void>;
  handleRegistrationComplete: () => void;
}

/**
 * Custom hook to handle AI chat functionality
 * @param propertyId - The property ID for context
 * @returns Object with chat state and handler functions
 */
export function useAIChat({ propertyId }: UseAIFaqProps): UseAIFaqReturn {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase | null>(null);
  const [sessionId] = useState<string>(() => uuidv4());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: MESSAGE_TYPE.SUGGESTIONS,
      content: '',
      suggestions: SUGGESTED_QUESTIONS,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const phaseTimersRef = useRef<number[]>([]);

  // Get current property URL for HubSpot submission
  const propertyUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Get logged-in user data
  const { userData } = useUserContext();
  const { getLoggedInUser } = useLoggedInUser();
  const { hasLeadCaptured } = useLeadCapture();

  // Use the registration flow hook with property URL for HubSpot
  const { isRegistered, userInfo, processRegistration, completeRegistration } =
    useRegistrationFlow({
      propertyUrl,
    });

  // Track if we've already auto-registered
  const hasAutoRegistered = useRef(false);

  // Track if we've already added initial messages for restored session
  const hasAddedInitialMessages = useRef(false);

  // Add initial messages when user is registered but no real messages exist
  // (only the initial suggestions message is present)
  useEffect(() => {
    const realMessages = messages.filter(
      (m) => m.type !== MESSAGE_TYPE.SUGGESTIONS
    );
    if (
      isRegistered &&
      !hasAddedInitialMessages.current &&
      realMessages.length === 0
    ) {
      hasAddedInitialMessages.current = true;

      const now = Date.now();
      // Check cookie directly to avoid async state timing issues
      const { isLoggedIn, firstName } = getLoggedInUser();

      // 1. Greeting message (smaller font)
      const greetingMessage: ChatMessage = {
        id: `${now}-greeting`,
        type: MESSAGE_TYPE.GREETING,
        content: JSON.stringify({
          text_md: `**${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_1}${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_2}**\n\n${AI_CHAT_MESSAGES.REGISTRATION.GREETING_SUBTITLE}`,
        }),
        timestamp: new Date(),
      };

      // Welcome message - personalized for logged-in users
      const welcomeText =
        isLoggedIn && firstName
          ? AI_CHAT_MESSAGES.REGISTRATION.WELCOME_BACK_WITH_NAME(firstName)
          : AI_CHAT_MESSAGES.REGISTRATION.WELCOME_BACK;
      const welcomeMessage = createAIMessage(welcomeText);
      welcomeMessage.id = `${now}-welcome`;

      if (isLoggedIn) {
        // Logged-in user: Simple greeting + welcome (no coupon)
        setMessages([greetingMessage, welcomeMessage]);
      } else {
        // Non-logged-in user: Show coupon flow
        const promoMessage = createAIMessage(
          AI_CHAT_MESSAGES.REGISTRATION.PROMO_MESSAGE
        );
        promoMessage.id = `${now}-promo`;

        const couponMessage: ChatMessage = {
          id: `${now}-coupon`,
          type: MESSAGE_TYPE.COUPON,
          content: AI_CHAT_MESSAGES.REGISTRATION.COUPON_DESCRIPTION,
          timestamp: new Date(),
          couponCode: AI_CHAT_MESSAGES.REGISTRATION.COUPON_CODE,
        };

        setMessages([
          greetingMessage,
          promoMessage,
          couponMessage,
          welcomeMessage,
        ]);
      }
    }
  }, [isRegistered, messages, getLoggedInUser]);

  // Auto-register logged-in users (skip HubSpot and trackEvent for logged-in users)
  useEffect(() => {
    if (hasLeadCaptured()) {
      hasAutoRegistered.current = true;
      return;
    }

    if (
      !hasAutoRegistered.current &&
      !isRegistered &&
      userData?.firstName &&
      userData?.phone
    ) {
      hasAutoRegistered.current = true;

      // Build user info from logged-in user data (no HubSpot, no trackEvent)
      const firstName = userData?.firstName;
      const lastName = userData?.lastName || '';
      const phone = userData.phone?.replace(/^\+\d{1,3}/, '') || '';
      const countryCode = userData.countryCode || '+91';

      const now = Date.now();

      // 1. Greeting message (smaller font)
      const greetingMessage: ChatMessage = {
        id: `${now}-greeting`,
        type: MESSAGE_TYPE.GREETING,
        content: JSON.stringify({
          text_md: `**${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_1}${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_2}**\n\n${AI_CHAT_MESSAGES.REGISTRATION.GREETING_SUBTITLE}`,
        }),
        timestamp: new Date(),
      };

      // 2. AI welcome message (no coupon for logged-in users)
      const welcomeMessage = createAIMessage(
        AI_CHAT_MESSAGES.REGISTRATION.WELCOME_FIRST_TIME(firstName || 'there')
      );
      welcomeMessage.id = `${now}-welcome`;

      // Add messages (simple greeting + welcome for logged-in users)
      setMessages((prev) => [...prev, greetingMessage, welcomeMessage]);

      // Complete registration directly (no HubSpot/trackEvent for logged-in users)
      completeRegistration({
        firstName,
        lastName,
        phone,
        countryCode,
      });
    }
  }, [userData, isRegistered, completeRegistration, hasLeadCaptured]);

  // Store pending registration data between form submit and completion
  const pendingRegistrationRef = useRef<{
    name: string;
    phone: string;
    firstName: string;
    lastName: string;
    countryCode: string;
  } | null>(null);

  // Handle form submission - submit to HubSpot but don't complete registration yet
  const handleFormSubmit = useCallback(
    async (data: { name: string; phone: string; countryCode: string }) => {
      // Process registration (HubSpot, tracking) but don't set isRegistered yet
      const result = await processRegistration(data);

      // Store for later when user clicks "Continue to Chat"
      pendingRegistrationRef.current = {
        name: data.name,
        phone: data.phone,
        firstName: result.firstName,
        lastName: result.lastName,
        countryCode: data.countryCode,
      };
    },
    [processRegistration]
  );

  // Handle registration completion - called when user clicks "Continue to Chat"
  const handleRegistrationComplete = useCallback(() => {
    const data = pendingRegistrationRef.current;
    if (!data) return;

    const now = Date.now();

    // 1. Greeting message (smaller font)
    const greetingMessage: ChatMessage = {
      id: `${now}-greeting`,
      type: MESSAGE_TYPE.GREETING,
      content: JSON.stringify({
        text_md: `**${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_1}${AI_CHAT_MESSAGES.REGISTRATION.GREETING_TITLE_2}**\n\n${AI_CHAT_MESSAGES.REGISTRATION.GREETING_SUBTITLE}`,
      }),
      timestamp: new Date(),
    };

    // 2. Promo message
    const promoMessage = createAIMessage(
      AI_CHAT_MESSAGES.REGISTRATION.PROMO_MESSAGE
    );
    promoMessage.id = `${now}-promo`;

    // 3. Coupon card message
    const couponMessage: ChatMessage = {
      id: `${now}-coupon`,
      type: MESSAGE_TYPE.COUPON,
      content: AI_CHAT_MESSAGES.REGISTRATION.COUPON_DESCRIPTION,
      timestamp: new Date(),
      couponCode: AI_CHAT_MESSAGES.REGISTRATION.COUPON_CODE,
    };

    // 4. AI welcome message
    const welcomeMessage = createAIMessage(
      AI_CHAT_MESSAGES.WELCOME_MESSAGE(data?.firstName || 'there')
    );
    welcomeMessage.id = `${now}-welcome`;

    // Add all messages in sequence (no user details shown)
    setMessages((prev) => [
      ...prev,
      greetingMessage,
      promoMessage,
      couponMessage,
      welcomeMessage,
    ]);

    // Then complete registration (this sets isRegistered to true)
    completeRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      countryCode: data.countryCode,
    });

    // Clear pending data
    pendingRegistrationRef.current = null;
  }, [completeRegistration]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Function to send the actual AI request
  const sendAIRequest = useCallback(
    async (questionToSend: string) => {
      setIsLoading(true);
      setLoadingPhase('analyzing');

      // Progress through phases for better UX while awaiting response
      startLoadingPhaseTimers(setLoadingPhase, phaseTimersRef);

      try {
        const result = await askAIQuestion({
          propertyId,
          question: questionToSend,
          sessionId,
        });

        if (result && result?.response && result?.status === 'completed') {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: MESSAGE_TYPE.AI,
            content: result?.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          setMessages((prev) => [
            ...prev,
            createAIMessage(AI_CHAT_MESSAGES.ERROR_PROCESSING),
          ]);
        }
      } catch (error) {
        console.error('AI Chat Error:', error);
        setMessages((prev) => [
          ...prev,
          createAIMessage(AI_CHAT_MESSAGES.ERROR_WITH_MESSAGE()),
        ]);
      } finally {
        clearLoadingPhaseTimers(phaseTimersRef);
        setIsLoading(false);
        setLoadingPhase(null);
      }
    },
    [propertyId, sessionId]
  );

  const handleSendMessage = useCallback(
    async (message?: string) => {
      const messageToSend =
        message || (typeof question === 'string' ? question.trim() : '');
      if (!messageToSend || isLoading || !isRegistered) return;

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: MESSAGE_TYPE.USER,
        content: messageToSend,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Clear input
      if (!message) {
        setQuestion('');
      }

      // Send to AI
      await sendAIRequest(messageToSend);
    },
    [question, isLoading, isRegistered, sendAIRequest]
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading && question.trim() && isRegistered) {
        await handleSendMessage();
      }
    },
    [handleSendMessage, isLoading, question, isRegistered]
  );

  return {
    question,
    setQuestion,
    isLoading,
    loadingPhase,
    messages,
    messagesEndRef,
    handleSendMessage,
    handleKeyDown,
    isRegistered,
    userInfo,
    handleFormSubmit,
    handleRegistrationComplete,
  };
}
