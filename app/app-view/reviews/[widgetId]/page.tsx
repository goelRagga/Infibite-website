interface WidgetIdProps {
  params: Promise<{
    widgetId: string;
  }>;
}

export default async function PropertyDetail(props: WidgetIdProps) {
  const params = await props.params;

  return (
    <div>
      <div className={params?.widgetId} data-elfsight-app-lazy></div>
    </div>
  );
}
