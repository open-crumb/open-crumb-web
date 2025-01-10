import NextLink, { type LinkProps as NextLinkProps } from "next/link";

type Props = NextLinkProps & {
	children: React.ReactNode;
};

export function Link(props: Props) {
	return (
		<NextLink
			className="text-amber-800 hover:text-amber-600 focus:text-amber-700"
			{...props}
		/>
	);
}
