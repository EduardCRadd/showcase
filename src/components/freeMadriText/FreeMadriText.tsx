import Image from "next/image";
import { type FC } from "react"

import FreeMadri from "@/assets/images/free-madri.svg"

const FreeMadriText: FC = () => {
    return <Image src={FreeMadri} alt="Free Madri" style={{ width: "100%" }} />
}

export default FreeMadriText