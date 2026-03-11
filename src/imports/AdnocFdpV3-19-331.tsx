import svgPaths from "./svg-px41claept";
import imgContainer from "figma:asset/29d84608804561cf1c266f79fbbb071776691efd.png";
import imgImageAdnocLogo from "figma:asset/9beb0d38a15a59ea10724901fda4b02c359da990.png";

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

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[52px] items-start left-0 top-0 w-[400px]" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Login() {
  return (
    <div className="absolute left-[96.37px] size-[16px] top-[11px]" data-name="Login">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Login">
          <path d={svgPaths.p32beabb0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute border border-[rgba(0,200,200,0.15)] border-solid h-[40px] left-0 rounded-[12px] top-[84px] w-[400px]" data-name="Button">
      <Login />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[211.37px] not-italic text-[14px] text-center text-white top-[9.5px]">Sign in with Corporate SSO</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-[#111827] h-[40px] left-0 rounded-[12px] top-[192px] w-[400px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#4a5568] text-[14px]">user@adnoc.com</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-[#111827] h-[40px] left-0 rounded-[12px] top-[256px] w-[400px]" data-name="Input">
      <div className="content-stretch flex items-center overflow-clip px-[12px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#4a5568] text-[14px]">Password</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#06f] h-[40px] left-0 rounded-[12px] shadow-[0px_10px_15px_0px_rgba(0,102,255,0.2),0px_4px_6px_0px_rgba(0,102,255,0.2)] top-[320px] w-[400px]" data-name="Button">
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

function Container5() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-center left-0 top-0 w-[400px]" data-name="Container">
      <Container5 />
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

function Container6() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start justify-center left-0 top-0 w-[400px]" data-name="Container">
      <Text />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[20px] left-0 top-[148px] w-[400px]" data-name="Container">
      <Container4 />
      <Container6 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[408px] relative shrink-0 w-[400px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container2 />
        <Button />
        <Input />
        <Input1 />
        <Button1 />
        <Button2 />
        <Container3 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[#0d1424] content-stretch flex h-[985px] items-center justify-center left-[668px] top-0 w-[668px]" data-name="Container">
      <Container1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[985px] left-0 opacity-30 top-0 w-[668px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer} />
    </div>
  );
}

function ImageAdnocLogo() {
  return (
    <div className="relative shrink-0 size-[80px]" data-name="Image (ADNOC Logo)">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageAdnocLogo} />
    </div>
  );
}

function Container10() {
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

function Paragraph1() {
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

function Container11() {
  return (
    <div className="absolute h-[60px] left-[49px] top-[253px] w-[350px]" data-name="Container">
      <Badge />
      <Badge1 />
      <Badge2 />
    </div>
  );
}

function Container9() {
  return (
    <div className="-translate-x-1/2 absolute h-[354px] left-1/2 rounded-[24px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] top-[315.5px] w-[448px]" data-name="Container">
      <Container10 />
      <Heading />
      <Paragraph1 />
      <Container11 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-gradient-to-b from-[#060a14] h-[985px] left-0 overflow-clip to-[#0d1424] top-0 w-[668px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

export default function AdnocFdpV() {
  return (
    <div className="bg-[#080c18] relative size-full" data-name="ADNOC FDP v3">
      <Container />
      <Container7 />
    </div>
  );
}