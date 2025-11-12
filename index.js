module.exports = {
  onLoad() {
    this.unpatch = vendetta.patcher.patch("messages.send", (args, original) => {
      const msg = args[0];
      const keywords = vendetta.plugin.storage.get("keywords");
      if (msg && msg.webhookId && keywords) {
        const parts = keywords.split(",").map(k => k.trim()).filter(k => k);
        for (const kw of parts) {
          if (msg.author && msg.author.username && msg.author.username.includes(kw)) {
            return { canceled: true };
          }
        }
      }
      return original(...args);
    });
  },
  onUnload() {
    this.unpatch && this.unpatch();
  },
  Settings: () => {
    const [keywords, setKeywords] = vendetta.plugin.storage.useState("keywords", "");
    const { Card, Text } = vendetta.ui.components;
    const { TextInputRow } = vendetta.ui.settings.components;
    return (
      <Card>
        <Text variant="heading">Webhook Filter</Text>
        <TextInputRow
          label="Keywords (comma-separated)"
          value={keywords}
          onChange={setKeywords}
        />
      </Card>
    );
  }
};
