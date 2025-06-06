import { Link, useLocation } from "wouter";
import { Button } from "../ui/button";
import { Zap, LogOut } from "lucide-react";

// Dummy data for demonstration; replace with your actual data and logic
const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: Zap },
	// Add more navigation items as needed
];
const user = { username: "admin" };
const logout = () => {
	// Implement logout logic here
};

export default function Sidebar() {
	const [location] = useLocation();

	return (
		<aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
			<div className="p-6 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
						<Zap className="w-6 h-6 text-white" />
					</div>
					<div>
						<h1 className="text-xl font-bold text-gray-900">ChargeFleet</h1>
						<p className="text-sm text-gray-600">Fleet Management</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 p-4 space-y-2">
				{navigation.map((item) => {
					const isActive = location === item.href;
					const Icon = item.icon;

					return (
						<Link key={item.name} href={item.href}>
							<Button
								variant={isActive ? "default" : "ghost"}
								className={`w-full justify-start ${
									isActive
										? "bg-primary text-white"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Icon className="mr-3 h-4 w-4" />
								{item.name}
							</Button>
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-gray-200">
				<div className="flex items-center space-x-3 mb-4">
					<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
						<span className="text-white text-sm font-medium">
							{user?.username?.charAt(0).toUpperCase()}
						</span>
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium text-gray-900">
							{user?.username}
						</p>
						<p className="text-xs text-gray-600">Fleet Manager</p>
					</div>
				</div>
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={logout}
				>
					<LogOut className="mr-2 h-4 w-4" />
					Logout
				</Button>
			</div>
		</aside>
	);
}