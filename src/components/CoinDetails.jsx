import { Button, Box, Container, RadioGroup, Radio, HStack, VStack, Text, Image, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Badge, Progress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import { server } from '../index';
import axios from 'axios';
import ErrorComponent from './ErrorComponent';
import { useParams } from 'react-router-dom';
import Chart from './Chart';

const CoinDetails = () => {
    const [coin, setCoin] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currency, setCurrency] = useState("inr");
    const [chartArr, setChartArr] = useState([]);
    const [day, setDay] = useState("24h");

    const { id } = useParams();

    const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

    const currencySymbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
    useEffect(() => {
        const fetchCoin = async () => {
            try {

                const { data } = await axios.get(`${server}/coins/${id}`);
                const { data: chartData } = await axios.get(`${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${day}`)
                setCoin(data);
                setChartArr(chartData.prices);
                setLoading(false);

            }

            catch (error) {
                setError(true)
                setLoading(false)
            }
        };

        fetchCoin()
    }, [id, currency, day])

    const switchChartStats = (key) => {
        switch (key) {
            case "24h":
                setDay("24h");
                // setLoading(true)
                break;
            case "7d":
                setDay("7d");

                break;
            case "14d":
                setDay("14d");

                break;
            case "30d":
                setDay("30d");

                break;
            case "60d":
                setDay("60d");

                break;
            case "200d":
                setDay("200d");

                break;
            case "1y":
                setDay("365d");

                break;
            case "max":
                setDay("max");

                break;

            default:
                setDay("24h");

                break;
        }
    }

    if (error) return (
        <ErrorComponent message={"Error while fetching coin details"} />
    )

    return (
        <Container maxW={"container.xl"}>
            {
                loading ? <Loader /> :
                    <>
                        <Box width={"full"} borderWidth={1}>
                            <Chart arr={chartArr} currency={currency} day={day} />
                        </Box>

                        <HStack p="4" overflowX={"auto"}>

                            {
                                btns.map((i) => (
                                    <Button
                                        disabled={day == i}
                                        key={i}
                                        onClick={() => switchChartStats(i)}
                                    >
                                        {i}
                                    </Button>
                                ))}
                        </HStack>


                        <RadioGroup value={currency} onChange={(e) => setCurrency(e)} p={"8"}>
                            <HStack spacing={"4"}>
                                <Radio value='inr'>INR</Radio>
                                <Radio value='usd'>USD</Radio>
                                <Radio value='eur'>EUR</Radio>

                            </HStack>
                        </RadioGroup>

                        <VStack spacing={"4"} p={"4"} alignItems={"flex-start"} >
                            <Text fontSize={"small"} alignSelf={"center"} opacity={"0.7"}>
                                Last Updates on {coin.market_data.last_updated.split("G")[0]}
                            </Text>

                            <Image src={coin.image.large} w={"16"} h={"16"} objectFit={"contain"} />

                            <Stat>

                                <StatLabel>{coin.name}</StatLabel>
                                <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>
                                <StatHelpText>
                                    <StatArrow type={coin.market_data.price_change_percentage_24h > 0 ? "increase" : "decrease"} />
                                    {coin.market_data.price_change_percentage_24h}%
                                </StatHelpText>
                            </Stat>

                            <Badge fontSize={"2xl"}>
                                {`#${coin.market_cap_rank}`}
                            </Badge>

                            <CustomBar high={`${currencySymbol}${coin.market_data.high_24h[currency]}`} low={`${currencySymbol}${coin.market_data.low_24h[currency]}`} />




                            <Box w={"full"} p={"4"}>
                                <Item title={"Max Supply"} value={coin.market_data.max_supply} />
                                <Item title={"Circulating Supply"} value={coin.market_data.circulating_supply} />
                                <Item title={"Market Cap"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`} />
                                <Item title={"All time low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`} />
                                <Item title={"All time high"} value={`${currencySymbol}${coin.market_data.ath[currency]}`} />

                            </Box>
                        </VStack>

                    </>
            }
        </Container>
    )
}

const CustomBar = ({ high, low }) => (
    <VStack w={"full"}>
        <Progress value={'50'} colorScheme='teal' w={'full'} />
        <HStack w={"full"} justifyContent={"space-between"}>
            <Badge colorScheme='red'>{low}</Badge>
            <Text fontSize={"sm"}>24H Range</Text>
            <Badge colorScheme='green'>{high}</Badge>


        </HStack>
    </VStack>

)


const Item = ({ title, value }) => (
    <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
        <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>{title}</Text>
        <Text >{value ? value : "Not Available"}</Text>


    </HStack>
)


export default CoinDetails