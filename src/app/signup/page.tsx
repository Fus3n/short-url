'use client'

import { useState, useEffect} from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Link2 } from "lucide-react"
import { useRouter } from 'next/navigation';
import { getMe } from "@/lib/utils"
import axios from 'axios';

const Signup = () => {
    const { push } = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        getMe().then((user) => {
            if (user) {
                push('/dashboard');
            }
        })
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const name = data.get("name") as string;
        const email = data.get("email") as string;
        const password = data.get("password") as string;

        if (!name || !email || !password) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            await axios.post("/api/auth/register", { 
                name,
                email, 
                password, 
                rememberMe 
            });
            // push('/dashboard');
        } catch (error) {
            const err = error as {response: {data: {error: string}}};
            const errMsg = err.response?.data.error ?? "Something went wrong";
            toast({
                title: "Error",
                description: errMsg,
                variant: "destructive",
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel */}
            <div className="hidden md:flex flex-col justify-between w-[45%] bg-muted/30 p-12">
                <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <Link2 className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            ShortLinks
                        </span>
                    </Link>
                </div>

                <div className="space-y-6">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Welcome aboard!
                    </h1>
                    <Separator className="w-[40%]" />
                    <blockquote className="border-l-2 pl-6 italic text-muted-foreground">
                        "The best way to predict the future is to create it." - Peter Drucker
                    </blockquote>
                </div>

                <p className="text-sm text-muted-foreground">
                    © 2024 ShortLinks. All rights reserved.
                </p>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Start shortening your links today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input 
                                    required 
                                    id="name"
                                    type="text" 
                                    placeholder="Enter your name" 
                                    name="name" 
                                    autoComplete="name" 
                                    className="h-11"
                                    minLength={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    required 
                                    id="email"
                                    type="email" 
                                    placeholder="Enter your email" 
                                    name="email" 
                                    autoComplete="email" 
                                    className="h-11"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    required 
                                    id="password"
                                    type="password" 
                                    placeholder="Enter your password" 
                                    name="password" 
                                    autoComplete="new-password" 
                                    className="h-11"
                                    minLength={8}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember-me" 
                                    name="remember-me" 
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                />
                                <Label htmlFor="remember-me" className="text-sm">
                                    Remember me
                                </Label>
                            </div>
                        </div>

                        <Button 
                            disabled={loading}
                            type="submit" 
                            className="w-full h-11"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-primary hover:text-primary/80" 
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-center text-muted-foreground max-w-[300px] mx-auto" >No you can't change password for now, so choose wisely and remember it :)</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
