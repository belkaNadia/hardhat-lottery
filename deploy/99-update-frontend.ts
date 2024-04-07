import fs from "fs"
import { ethers, network } from "hardhat"

const FRONT_END_ADDRESSES_FILE =
    "/Users/nadiawhite/Documents/Projects/SmartContracts/hardhat-lottery-ui/constants/contractAddresses.json"
const FRONT_END_ABI_FILE =
    "/Users/nadiawhite/Documents/Projects/SmartContracts/hardhat-lottery-ui/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        console.log("Cyrrent", process.cwd())
        updateContractAddressess()
        updateAbis()
    }
}

async function updateContractAddressess() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId?.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE).toString())
    if (chainId && chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address)
        }
    } else if (chainId) {
        contractAddresses[chainId] = [raffle.address]
    }

    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(contractAddresses))
}

async function updateAbis() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(
        FRONT_END_ABI_FILE,
        JSON.stringify({ Raffle: raffle.interface.format("json") })
    )
}
