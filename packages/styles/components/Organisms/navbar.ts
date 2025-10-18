import tw from "../../private";

const nav = tw`sticky top-0 z-10 bg-white p-2 text-sm text-cyan-800`;
const list = tw`flex list-none justify-end gap-2.5`;
const listItem = tw`px-2`;
const navlink = (isActive: boolean) =>
  tw`${isActive ? "active" : ""} underline-offset-7 [&.active]:pointer-events-none [&.active]:cursor-default [&.active]:underline`;

const logoutButton = tw`cursor-pointer`;

export default { nav, list, listItem, navlink, logoutButton };
