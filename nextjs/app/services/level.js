import { ethers } from "ethers";

/**
 * Fetch the level of a user from the contract.
 * @param {string} user - Ethereum address of the user
 * @param {ethers.Contract} contract - Initialized contract instance
 * @returns {Promise<{ success: boolean, level?: number, error?: string }>}
 */
export async function getLevel(user, contract) {
    console.log("getlevel", user)
    if (!contract) throw new Error("Contract not initialized");
    if (!ethers.isAddress(user)) throw new Error("Invalid user address");

    try {
        // Call the view function on the contract
        const level = await contract.getLevel(user);
        return { success: true, level: Number(level) }; // Convert BigNumber to number
    } catch (err) {
        console.error("getLevel failed:", err);
        return { success: false, error: err.message || "Failed to fetch level" };
    }
}
export async function setLevel(contract, user, totalHours, newLevel, signature) {
    console.log("userAddress")
    if (!contract) throw new Error("Contract not initialized");
    if (!ethers.isAddress(user)) throw new Error("Invalid user address");
    if (typeof totalHours !== "number" || totalHours <= 0) throw new Error("Invalid totalHours");
    if (typeof newLevel !== "number" || newLevel <= 0) throw new Error("Invalid newLevel");

    try {
        // console.log(`Calling logStudySigned for ${userAddress}...`);

        const tx = await contract.logStudySigned(user, totalHours, newLevel, signature);
        const receipt = await tx.wait();
        const filter = contract.filters.StudyLogged(user);
        const events = await contract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
        // StudyLogged(user, totalHours, newLevel)
        let nL = null;
        for (const e of events) { nL = e.args?.nL?.toString() };
        // console.log(`Study logged successfully! Transaction Hash: ${tx.hash}`);
        // console.log("New Level from event:", newLevel);
        return {
            success: true,
            txHash: tx.hash,
            // newLevel
        };
    } catch (err) {
        console.error("Failed to log study stats:", err);
        return {
            success: false,
            error: err?.message || "Unknown error"
        };
    }
}
