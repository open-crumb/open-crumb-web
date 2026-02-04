import { Link } from "@/ui/design/link";
import { Button } from "@/ui/design/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/ui/design/navigation-menu";
import { signOutAction } from "@/ui/auth/actions";

type Props = {
	isSignUpEnabled: boolean;
	isAuthenticated: boolean;
};

export default function Header({ isSignUpEnabled, isAuthenticated }: Props) {
	return (
		<div className="container">
			<NavigationMenu className="-mx-md">
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="/">Open Crumb</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					{isAuthenticated && (
						<NavigationMenuItem>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
								asChild
							>
								<Link href="/dashboard">Dashboard</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					)}
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="/calculators">Calculators</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					{isAuthenticated && (
						<NavigationMenuItem>
							<form action={signOutAction}>
								<NavigationMenuLink
									className={navigationMenuTriggerStyle()}
									asChild
								>
									<Button type="submit" variant="link">
										Sign Out
									</Button>
								</NavigationMenuLink>
							</form>
						</NavigationMenuItem>
					)}
					{!isAuthenticated && (
						<NavigationMenuItem>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
								asChild
							>
								<Link href="/sign-in">Sign In</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					)}
					{isSignUpEnabled && (
						<NavigationMenuItem>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}
								asChild
							>
								<Link href="/sign-up">Sign Up</Link>
							</NavigationMenuLink>
						</NavigationMenuItem>
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
