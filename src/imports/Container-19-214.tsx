import imgImageAdnocLogo from "figma:asset/9beb0d38a15a59ea10724901fda4b02c359da990.png";

function ImageAdnocLogo() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Image (ADNOC Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAdnocLogo} />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex h-[80px] items-start justify-center left-[49px] top-[41px] w-[350px]" data-name="Container">
      <ImageAdnocLogo />
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute h-[40px] left-[49px] top-[145px] w-[350px]" data-name="Heading 1">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[81px] leading-[0] left-[174.5px] not-italic text-[0px] text-[48px] text-center text-white top-[-0.5px] tracking-[-0.72px] w-[393px] whitespace-pre-wrap">
        <span className="leading-[40px]">{`ADNOC `}</span>
        <span className="leading-[40px] text-[#06f]">AI FDP</span>
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[24px] left-[49px] top-[197px] w-[350px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[174.82px] not-italic text-[#00bcd4] text-[20px] text-center top-[-1px]">AI-Enabled Field Development Planning</p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex h-[26px] items-center left-[42.55px] px-[11px] py-[5px] rounded-[16777200px] top-0 w-[108.297px]" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#00bcd4] text-[12px]">✨ 12 AI Agents</p>
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex h-[26px] items-center left-[158.85px] px-[11px] py-[5px] rounded-[16777200px] top-0 w-[148.586px]" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#00bcd4] text-[12px]">⚡ Real-time Analytics</p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex h-[26px] items-center left-[96.32px] px-[11px] py-[5px] rounded-[16777200px] top-[34px] w-[157.359px]" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#00bcd4] text-[12px]">🔒 Domain-Fenced SLM</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[60px] left-[49px] top-[253px] w-[350px]" data-name="Container">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative rounded-[24px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] size-full" data-name="Container">
      <Container1 />
      <Heading />
      <Paragraph />
      <Container2 />
    </div>
  );
}