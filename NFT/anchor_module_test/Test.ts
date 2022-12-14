
import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";

import { Provider, Program, setProvider, AnchorProvider, Wallet, web3, BN,} from '@project-serum/anchor'

const { SystemProgram } = web3;
// https://coral-xyz.github.io/anchor/ts/index.html#setProvider


const programId = "BPrW9qJNafGsKTWraRecHapUXxQs8hbrR6VMDoLicfbL";
const id1 = require("./target/idl/basic_1.json")

const init  = async () =>{
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    let fromWallet = Keypair.generate();

    console.log("")

    console.log("created Wallet is : ",fromWallet.publicKey)
    console.log("created Wallet is : ",fromWallet.publicKey.toBase58())
    
    console.log("")

    let fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(fromAirdropSignature);


    // ** anchor 설정 **

    const anchorWallet  = new Wallet(fromWallet);
    const provider = new AnchorProvider(connection, anchorWallet, {})
    const program = new Program(id1 ,programId, provider)
    // const beforeData = await program.account.myAccount.fetch(newTestAccount.publicKey)

    // console.log("beforeData : ",beforeData)
    // -> 에러가 뜬다.
    // -> 왜냐하면 initialize가 되지 않아서 새로운 account가 없음


    await program.rpc.initialize(new BN(3), {
      accounts : {
        myAccount : fromWallet.publicKey,
        user : fromWallet.publicKey,
        systemProgram : SystemProgram.programId.toBase58()
      },
      signers : [fromWallet]
    })

    const afterData = await program.account.myAccount.fetch(fromWallet.publicKey)

    // 새로만들어진 key값을 통해서 조회가 가능한것은 알겟는데 이러면 트랜잭션을 날릴떄마다 새로운 값을 조회해야 하나...??
    // -> 그러지 않아도 된다. 애초에 저장공간은 wallet과 동일하게 두면 해당 공간에만 접근이 가능하다.
    // 이후 smartContract에서 조건만을 추가하여 처리하면 된다.

    console.log(program.account)


    console.log("afterData : ",afterData)

}

init()
