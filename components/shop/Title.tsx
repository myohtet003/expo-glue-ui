import { HStack } from "../ui/hstack"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"

type TitleProps = {
	title?: string;
	actionText?: string
} 

const Title = ({title,actionText}: TitleProps) => {
  return (
	 <HStack className=" justify-between items-center ">
		<Text size="lg" className=" font-medium text-black">{title}</Text>
		<Pressable>
			<Text>{actionText}</Text>
		</Pressable>
	 </HStack>
  )
}

export default Title