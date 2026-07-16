import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export default function StrokeIcon<T extends boolean = true>(props: {
	icon: IconSvgElement;
	render?: T;
	className?: string;
	size?: number;
	strokeWidth?: number;
}) {
	if (props.render === false) {
		return undefined;
	}
	return (
		<HugeiconsIcon
			icon={props.icon}
			size={props.size ?? 14}
			strokeWidth={props.strokeWidth}
			className={props.className}
		/>
	);
}
