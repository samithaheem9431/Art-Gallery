export default function ApiNotice({ message = "Could not load artwork from the server." }) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 text-center md:px-8">
      <p className="text-muted">{message}</p>
      <p className="mt-2 text-sm text-muted">
        Make sure the backend is running. On Vercel, set <code>BACKEND_URL</code> to your live API
        host.
      </p>
    </div>
  );
}
