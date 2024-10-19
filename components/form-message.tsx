export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-sm">
      {"success" in message && (
        <div className="border-l-2 border-foreground px-4 text-foreground">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="border-l-2 border-destructive-foreground px-4 text-destructive-foreground">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="border-l-2 px-4 text-foreground">{message.message}</div>
      )}
    </div>
  );
}
