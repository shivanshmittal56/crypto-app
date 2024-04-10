import React from 'react'
import { VStack, Image, Heading, Text } from "@chakra-ui/react"
import { Link } from 'react-router-dom'
const CoinCard = ({ name, img, id, symbol, price, currencySymbol = "₹" }) => {
    return (
        <Link to={`/coins/${id}`}>
            <VStack w={"52"} shadow={"lg"} p={"8"} borderRadius={"lg"} transition={"all o.3s"} m={"4"} css={{
                "&:hover": {
                    transform: "scale(1.1)"
                }
            }} >
                <Image src={img} w={'10'} h={"10"} objectFit={"contain"} alt='coin' />
                <Heading size={"md"} noOfLines={1} >{symbol}</Heading>
                <Text noOfLines={1}>{name}</Text>
                <Text noOfLines={1}>{price ? `${currencySymbol}${price}` : ""}</Text>

            </VStack>
        </Link>
    )
}

export default CoinCard