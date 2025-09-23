import { ethers } from "ethers";

export async function mint(to, contract) {
    if (!contract) throw new Error("Contract not initialized");
    if (!ethers.isAddress(to)) throw new Error("Invalid address");

    try {
        const tx = await contract.mint(to);
        const receipt = await tx.wait();

        const filter = contract.filters.Minted(to);
        const events = await contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);

        let tokenId = null;
        for (const e of events) tokenId = e.args?.tokenId?.toString();

        if (!tokenId) throw new Error("Mint event not found");
        return { success: true, tokenId };
    } catch (err) {
        console.error("MintNFT failed:", err);
        return { success: false, error: err.message || "Mint failed" };
    }
}
/**
 * Get tokenURI of a specific tokenId
 * @param {string|number} tokenId
 * @param {ethers.Contract} contract
 */
export async function getNftUri(tokenId, contract) {
    if (!contract) throw new Error("Contract not initialized");

    try {
        const uri = await contract.tokenURI(tokenId);
        return { success: true, tokenURI: uri };
    } catch (err) {
        console.error("getTokenURI failed:", err);
        return { success: false, error: err.message || "Failed to fetch tokenURI" };
    }
}
