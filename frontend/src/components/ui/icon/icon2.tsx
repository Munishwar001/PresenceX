import type { LucideIcon } from "lucide-react";

export default function StrokeIcon2<T extends boolean = true>(props: {
	icon: LucideIcon;
	width?: number | string;
	height?: number | string;
	render?: T;
}) {
	if (props.render === false) {
		return undefined;
	}
	const Icon = props.icon;
	return <Icon width={props.width} height={props.height} />;
}
