export default function ConfigError() {
  return (
    <div className="bg-surface-alt flex items-center justify-center min-h-screen w-full px-md">
      <div className="bg-surface border border-border rounded-lg shadow-lg flex flex-col gap-md items-start px-xl py-2xl w-full max-w-[480px]">
        <p className="font-bold text-xl text-text-primary">Habitly isn't configured yet</p>
        <p className="text-sm text-text-secondary">
          This deployment is missing its Supabase connection. Set these environment variables where
          this app is hosted, then redeploy:
        </p>
        <pre className="bg-surface-alt border border-border rounded-md px-md py-sm text-xs text-text-primary w-full overflow-x-auto">
          VITE_SUPABASE_URL{"\n"}VITE_SUPABASE_ANON_KEY
        </pre>
        <p className="text-sm text-text-secondary">
          Both values are in Supabase under Settings → API. Locally, put them in{" "}
          <code className="text-text-primary">.env.local</code> instead.
        </p>
      </div>
    </div>
  );
}
