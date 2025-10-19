import tw from "../../private";

const main = tw`pb-5`;
const navbarWrapper = tw`mb-3 block`;
const page = {
  wrapper: tw`mx-auto flex max-w-[1200px] flex-col items-center overflow-x-auto px-3`,
  title: {
    wrapper: tw`mb-8 w-full max-w-prose`,
    titleWrapper: tw`justify-self-center`,
    subtitleWrapper: tw`mt-2 text-center text-sm text-neutral-500`,
  },
  contentWrapper: tw`relative`,
  backLink: {
    outerWrapper: tw`mt-3 flex justify-end`,
    innerWrapper: tw`aspect-square w-8`,
  },
};
export default { main, navbarWrapper, page };
