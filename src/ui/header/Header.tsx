import { Link } from "@/ui/design/link";
// import {
// 	LoginLink,
// 	LogoutLink,
// 	RegisterLink,
// } from "@kinde-oss/kinde-auth-nextjs/components";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/ui/design/navigation-menu";

type Props = {
	isAuthenticated: boolean;
};

export default function Header(props: Props) {
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
					<NavigationMenuItem>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link href="/calculators">Calculators</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
				{/* {!props.isAuthenticated && (
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <LoginLink>Sign In</LoginLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        )}
        {props.isAuthenticated && (
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <LogoutLink>Sign Out</LogoutLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        )} */}
			</NavigationMenu>
		</div>
	);
}
