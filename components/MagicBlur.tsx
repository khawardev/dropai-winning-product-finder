import BlurFade from './ui/BlurFade'

export const Blur = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<BlurFade className={className} delay={0.035} inView>
			{children}
		</BlurFade>
	)
}

export const BlurDelay = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<BlurFade className={className} delay={0.035 * 5} inView>
			{children}
		</BlurFade>
	)
}
export const BlurDelay2 = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<BlurFade className={className} delay={0.035 * 6} inView>
			{children}
		</BlurFade>
	)
}
export const BlurDelay3 = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<BlurFade className={className} delay={0.035 * 7} inView>
			{children}
		</BlurFade>
	)
}

export const BlurDelay4 = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<BlurFade className={className} delay={0.035 * 12} inView>
			{children}
		</BlurFade>
	)
}
