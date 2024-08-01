export class BroadcastDataBuilder {
  static build(content: string, assets?: string[]): any {
    return {
      content: {
        content,
        published: new Date().toISOString(),
        assets: assets?.map((asset) => this.createAsset(asset)),
      },
    };
  }

  private static createAsset(asset: string) {
    // TODO: not hard code the type as image.
    return {
      type: 'image' as 'image' | 'link' | 'audio' | 'video',
      references: [
        {
          referenceId: asset,
        },
      ],
    };
  }
}
