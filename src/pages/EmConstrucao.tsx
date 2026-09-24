/** Placeholder das telas ainda não implementadas; cada uma ganha seu arquivo na fase do roadmap (SPEC §14). */
export default function EmConstrucao({ titulo, fase }: { titulo: string; fase: string }) {
  return (
    <div className="container space-y-2 py-12">
      <h1 className="text-2xl font-bold">{titulo}</h1>
      <p className="text-muted-foreground">Esta tela chega na fase {fase}.</p>
    </div>
  );
}
