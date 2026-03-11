import svgPaths from "./svg-0r1qz7c4we";
import imgImageAdnocLogo from "figma:asset/9beb0d38a15a59ea10724901fda4b02c359da990.png";

function Section() {
  return <div className="h-0 shrink-0 w-full" data-name="Section" />;
}

function Heading1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] left-[200.02px] not-italic text-[24px] text-center text-white top-[-1px]">Sign In</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[199.57px] not-italic text-[#7b8ca8] text-[14px] text-center top-[0.5px]">{`Access your asset's AI Assistant`}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[52px] items-start left-0 top-0 w-[400px]" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[96.37px] size-[16px] top-[11px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32beabb0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute border border-[rgba(0,200,200,0.15)] border-solid h-[40px] left-0 rounded-[12px] top-[84px] w-[400px]" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[211.37px] not-italic text-[14px] text-center text-white top-[9.5px]">Sign in with Corporate SSO</p>
    </div>
  );
}

function EmailInput() {
  return (
    <div className="absolute bg-[#111827] h-[40px] left-0 rounded-[12px] top-[192px] w-[400px]" data-name="Email Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#4a5568] text-[14px]">user@adnoc.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-[#111827] h-[40px] left-0 rounded-[12px] top-[256px] w-[400px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#4a5568] text-[14px]">Password</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#0047ba] h-[40px] left-0 rounded-[12px] shadow-[0px_10px_15px_0px_rgba(0,71,186,0.2),0px_4px_6px_0px_rgba(0,71,186,0.2)] top-[320px] w-[400px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[200.18px] not-italic text-[14px] text-center text-white top-[10.5px]">Sign In</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute h-[20px] left-[140.09px] top-[386.5px] w-[119.813px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[60px] not-italic text-[#00bcd4] text-[14px] text-center top-[0.5px]">Forgot password?</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[400px]" data-name="Container">
      <Container6 />
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#0d1424] h-[20px] relative shrink-0 w-[29.672px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[8px] not-italic text-[#7b8ca8] text-[14px] top-[0.5px]">or</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-center left-0 top-0 w-[400px]" data-name="Container">
      <Text />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[20px] left-0 top-[148px] w-[400px]" data-name="Container">
      <Container5 />
      <Container7 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[408px] relative shrink-0 w-[400px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container3 />
        <Button />
        <EmailInput />
        <PasswordInput />
        <Button1 />
        <Button2 />
        <Container4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bg-[#0d1424] content-stretch flex h-[943px] items-center justify-center left-[679.5px] top-0 w-[679.5px]" data-name="Container">
      <Container2 />
    </div>
  );
}

function Container9() {
  return <div className="absolute h-[943px] left-0 top-0 w-[679.5px]" data-name="Container" />;
}

function ImageAdnocLogo() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Image (ADNOC Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAdnocLogo} />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <ImageAdnocLogo />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[40px] relative shrink-0 w-[336.953px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] left-[168px] not-italic text-[48px] text-center text-white top-0 tracking-[-0.72px]">
          <span className="leading-[40px]">{`ADNOC `}</span>
          <span className="leading-[40px] text-[#0047ba]">AI FDP</span>
        </p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[48px] relative shrink-0 w-[352px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[176.49px] not-italic text-[#00bcd4] text-[20px] text-center top-[-0.5px] w-[296px] whitespace-pre-wrap">AI-Enabled Field Development Planning</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#00bcd4] text-[14px] top-[0.5px]">✨ 12 AI Agents</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex flex-col h-[38px] items-start left-[11.81px] pb-px pt-[9px] px-[17px] rounded-[16777200px] top-0 w-[134.68px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Paragraph2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#00bcd4] text-[14px] top-[0.5px]">⚡ Real-time Analytics</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex flex-col h-[38px] items-start left-[158.49px] pb-px pt-[9px] px-[17px] rounded-[16777200px] top-0 w-[181.688px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#00bcd4] text-[14px] top-[0.5px]">🔒 Domain-Fenced SLM</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[rgba(0,188,212,0.1)] content-stretch flex flex-col h-[38px] items-start left-[80.04px] pb-px pt-[9px] px-[17px] rounded-[16777200px] top-[50px] w-[191.914px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,188,212,0.2)] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <Paragraph4 />
    </div>
  );
}

function Container12() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[352px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container13 />
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.4)] content-stretch flex flex-col gap-[32px] h-[432px] items-center left-[115.75px] py-[40px] rounded-[24px] top-[255.5px] w-[448px]" data-name="Container">
      <Container11 />
      <Heading />
      <Paragraph1 />
      <Container12 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[943px] left-0 overflow-clip top-0 w-[679.5px]" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#080c18] h-[943px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container8 />
    </div>
  );
}

export default function AdnocFdpV() {
  return (
    <div className="bg-[#080c18] content-stretch flex flex-col items-start relative size-full" data-name="ADNOC FDP v6">
      <Section />
      <Container />
    </div>
  );
}