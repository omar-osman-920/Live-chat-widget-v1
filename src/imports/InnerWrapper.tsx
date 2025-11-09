export default function InnerWrapper() {
  return (
    <div className="relative size-full" data-name="inner-wrapper">
      <div className="absolute flex flex-col font-['Font_Awesome_6_Pro:Solid',sans-serif] justify-center leading-[0] left-[calc(50%+0.5px)] not-italic size-[32px] text-[#587ff8] text-[14px] text-center top-1/2 translate-x-[-50%] translate-y-[-50%]">
        <p className="leading-[normal]">messages</p>
      </div>
    </div>
  );
}