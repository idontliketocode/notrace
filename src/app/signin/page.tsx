"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		try {
			await signIn("credentials", { email, password, callbackUrl: "/" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
			<div className="w-full max-w-sm space-y-4 p-6 rounded-xl bg-zinc-900/60 backdrop-blur">
				<h1 className="text-xl font-semibold">Sign in</h1>
				<form onSubmit={submit} className="space-y-3">
					<input className="w-full rounded-md bg-zinc-800 px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
					<input className="w-full rounded-md bg-zinc-800 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
					<button disabled={loading} className="w-full rounded-md bg-white/10 hover:bg-white/20 py-2">{loading?"Signing in...":"Sign in"}</button>
				</form>
				<div className="flex gap-2">
					<button onClick={()=>signIn("github", { callbackUrl: "/" })} className="flex-1 rounded-md bg-white/10 hover:bg-white/20 py-2">GitHub</button>
					<button onClick={()=>signIn("google", { callbackUrl: "/" })} className="flex-1 rounded-md bg-white/10 hover:bg-white/20 py-2">Google</button>
				</div>
			</div>
		</div>
	);
}
