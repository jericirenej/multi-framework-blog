import tw from "../../private";

const dialog = tw`max-w-prose scale-75 rounded-lg p-3 px-8 opacity-50 shadow-lg backdrop-blur-md transition-[scale] [&.open]:mx-auto [&.open]:mt-[30vh] [&.open]:scale-100 [&.open]:opacity-100 [&.open]:backdrop:backdrop-blur-[6px]`;

const heading = tw`my-4 text-center text-3xl font-light`;
const contentWrapper = tw`mb-5`;
export default { dialog, heading, contentWrapper };
