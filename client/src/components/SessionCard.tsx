import { Button } from "@mui/joy";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import useDeleteSession from "../hooks/useDeleteSession";

type SessionData = {
	_id: string;
	userAgent?: string;
	createdAt: Date;
	expiresAt: Date;
	iscurrent?: boolean;
};

export default function SessionCard({ _id, userAgent, createdAt, expiresAt, iscurrent }: SessionData) {
	const { deleteThisSession, isPending } = useDeleteSession(_id);

	const handleDeleteSession = () => {
		deleteThisSession();
	};

	return (
		<Card
			orientation="horizontal"
			variant="outlined"
			sx={{
				p: 0,
				"--Card-padding": "0px",
				overflow: "hidden",
				backgroundColor: "background.body",
			}}>
			<CardOverflow
				variant="soft"
				color={iscurrent ? "success" : "warning"}
				sx={{
					p: 1,
					fontSize: "sm",
					writingMode: "vertical-lr",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",

					// make stripe touch the outer edge and square on the inner edge
					borderLeft: "1px solid",
					borderColor: "divider",
					// logical radii: rounded on the outer edge, square on the inner edge
					borderStartStartRadius: 0,
					borderEndStartRadius: 0,
					borderStartEndRadius: 0,
					borderEndEndRadius: 0,
				}}>
				{iscurrent ? "نشست فعال" : "غیرفعال"}
			</CardOverflow>

			<CardContent sx={{ p: 2 }}>
				<Typography textColor="text.primary" level="body-xs">
					{userAgent}
				</Typography>
				<Typography
					level="body-sm"
					sx={{ display: "flex", alignItems: "start", justifyContent: "start", gap: 1 }}>
					<span>تاریخ ساخت:</span>
					<span>{new Date(createdAt).toLocaleString("fa-IR")}</span>
				</Typography>
				<Typography
					level="body-sm"
					sx={{ display: "flex", alignItems: "start", justifyContent: "start", gap: 1 }}>
					<span>تاریخ انقضا:</span>
					<span>{new Date(expiresAt).toLocaleString("fa-IR")}</span>
				</Typography>
			</CardContent>
			{!iscurrent && (
				<Button
					loading={isPending}
					variant="soft"
					size="sm"
					onClick={handleDeleteSession}
					sx={{
						borderRadius: 0,
					}}>
					<CloseTwoToneIcon className="size-4" />
				</Button>
			)}
		</Card>
	);
}
