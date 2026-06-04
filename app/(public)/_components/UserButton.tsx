import {
    BoltIcon,
    ChevronDownIcon,
    LogOutIcon,
    MessageCircle, PenBoxIcon,
    PlusIcon,
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {authClient} from "@/lib/auth-client";
import Link from "next/link";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {FaTelegram} from "react-icons/fa";


interface Props {

    user: typeof authClient.$Infer.Session.user;
}



export function UserButton({user}: Props) {


    const router = useRouter();

    const handleLogout = async () => {

        await authClient.signOut({
            fetchOptions: {

                onSuccess: () => {
                    toast.success("Signed out successfully.");
                    router.refresh();
                }
            }
        });


    }



    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-auto p-0 hover:bg-transparent" variant="ghost">
                    <Avatar>
                        <AvatarImage alt="Profile image" src={user.image as string} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="opacity-60 ml-2"
                        size={16}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-foreground text-sm">
            {user.name}
          </span>
                    <span className="truncate font-normal text-muted-foreground text-xs">
            {user.email}
          </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href={'/user-setting'}>
                            <BoltIcon aria-hidden="true" className="opacity-60" size={16} />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/admin'}>

                            {/*redirect to admin page check if the user has a admin profile, if not prompt them to make one , if yes let them access admin however the url will be changed to admin-admin or something to reduce the number of filter checks in middleware*/}

                            <PenBoxIcon aria-hidden="true" className="opacity-60" size={16} />
                            <span>Publish</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/invite-friends'}>
                            <FaTelegram aria-hidden="true" className="opacity-60" size={16} />
                            <span>Invite friend</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                       <Link href={'/conversation'}>

                           {/*connect messaging app*/}

                           <MessageCircle aria-hidden="true" className="opacity-60" size={16} />
                           <span>Dms (NA yet)</span>

                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={'/go-premium'}>
                            <PlusIcon aria-hidden="true" className="opacity-60 animate-bounce transition-all" size={16} />
                            <span>Go premium</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon aria-hidden="true" className="opacity-60" size={16}/>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
