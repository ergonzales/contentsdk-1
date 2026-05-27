export type EmbedNoSSRProps = {
  embedRef: any;
  src: string;
  onLoad: () => void;
};

const EmbedNoSSR = (props: EmbedNoSSRProps) => {
  return (
    <embed
      ref={props.embedRef}
      className="block h-auto grow-[1000] shrink-[0] basis-[768px] max-h-[500px] max-w-full md:mb-16"
      src={"https://edge.sitecorecloud.io/chartwellma5b57-chartwellsxa-xmdev-2c04/media/Project/sxastarter/sxastarter/components/canadamap.svg?iar=0"}
      type="image/svg+xml"
      // eslint-disable-next-line react/no-unknown-property
      onLoad={props.onLoad}
    />
  );
};

export default EmbedNoSSR;
