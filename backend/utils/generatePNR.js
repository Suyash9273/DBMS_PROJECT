/**
 * Generates a random 6-character alphanumeric PNR.
 * e.g: 127AD9
 */

const generatePNR = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';

    for(let i=0; i<6; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return pnr;
}

export default generatePNR;