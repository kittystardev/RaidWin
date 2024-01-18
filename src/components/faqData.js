export const faqData = {
  "/faq": [
    {
      question: "What is RaidWin?",
      answer: (
        <span>
          RaidWin is the first platform in the world that allows users to bet
          against each other with the digital collectibles that they own
          on-chain. It is 100% PvP and there is no “house” you're
          betting(losing) against. Traditional betting sites are a scam, the
          house always has an edge and thus in the end the house always wins,
          but not here at RaidWin, all games are provably fair and the only
          opponents are the friends or strangers your playing with.
        </span>
      ),
    },
    {
      question: "What do i need to play?",
      answer:
        "You will need a Solana wallet + a digital collectible (nft) from a collection listed on RaidWin.",
    },
    {
      question:
        "How do I contact customer support for assistance or inquiries?",
      answer: (
        <span>
          Contact an admin inside the chatbox or e-mail us at
          <a
            href="mailto:support@raidwin.com"
            className="text-chat-tag cursor-pointer"
          >
            {" "}
            Contact Us
          </a>
        </span>
      ),
    },
    {
      question: "Are there any restrictions on the number of bets I can place?",
      answer:
        "No, there are currently no restrictions on the number of bets you can place.",
    },
    {
      question:
        "Can I view my betting and gaming results from previous sessions?",
      answer:
        "Yes, all your previously played games and games that you are still participating in are shown on your profile page",
    },
    {
      question: "Can I cancel a bet after placing it?",
      answer:
        "Yes, as long as the round of a game has not started yet you can still withdraw from the round if you happen to change your mind.",
    },
  ],
  "/Myaccount": [
    {
      question: "How do i change my profile picture, name or account details?",
      answer:
        "Go to the settings page on your profile page, you will be able to change details for your account.",
    },
    {
      question: "Can I link multiple Solana wallets to my account?",
      answer:
        "No, but you will be able to link your Ethereum account so you can play from both chains.",
    },
    {
      question: "Is my account information shared with third parties?",
      answer:
        "No, the platform values your privacy. Your account information is not shared with any third parties, and all data is treated in accordance with the platform's privacy policy.",
    },
    {
      question: "Is there a minimum age requirement to create an account?",
      answer:
        "Yes, you must be of legal age (21+) to create an account and participate in games on the platform. Please ensure you meet the age requirements according to your local laws before registering.",
    },
    {
      question: "Is there an account verification process?",
      answer:
        "No, the whole process is decentralized, we do however reserve the right to block access to accounts who attempt to abuse the platform.",
    },
    {
      question: "Can I link my social media accounts to my gaming profile?",
      answer:
        "Not yet, but we’re working on it so you can link your profiles from Twitter & Discord and ENS.",
    },
  ],
  "/getting-started": [
    {
      question: "How do i create a RaidWin account?",
      answer: (
        <>
          <span>
            Simply click on the button in the top-right corner of the the page
            (“Click to Connect”), and connect any Solana wallet.
          </span>
          <br />
          <br />
          <span>
            Don’t have a Solana wallet yet?{" "}
            <a
              href="https://phantom.app/download"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chat-tag font-bold"
            >
              {" "}
              Click here
            </a>{" "}
            to download the Phantom app which is compatible with Solana &
            Ethereum.
          </span>
        </>
      ),
    },
    {
      question: "How do i play my first game?",
      answer: (
        <>
          <span>
            Simply select a game you would like to play or browse by collections
            of collectibles to pick what you want to bet with.You will be
            prompted to deposit the digital collectible you want to play with
            and then the game can start!
          </span>
          <br />
          <br />
          <span>
            Don’t have any digital collectibles to play with yet? Buy one on{" "}
            <a
              href="https://magiceden.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chat-tag font-bold"
            >
              Magic Eden
            </a>{" "}
            or OpenSea.
          </span>
        </>
      ),
    },
  ],
  "/prabablyfair": [
    {
      question:
        "How do i know the games are fair and not rigged or possible to cheat?",
      answer:
        "RaidWin uses a Provably Fair system to guarantee the integrity of the system.",
    },
    {
      question: "What is Provably Fair?",
      answer:
        "The system operates by using random numbers to determine the outcomes of bets. These random numbers are generated using three components: the serverseed, the clientseed, and a nonce. Before the game commences, the serverseed is hashed and openly displayed. This process guarantees that the bet result remains unchangeable throughout the entire duration of the game. By disclosing the serverseed beforehand, players can independently verify that the outcomes are genuinely random and not influenced by any manipulation.",
    },
  ],
  "/deposits": [
    {
      question: "How do i make a deposit?",
      answer: (
        <>
          <span>
            Simply go to the game you want to play and click on the big “+”
            button to join the round, you will be prompted to confirm the
            transaction within your wallet to deposit your collectible that you
            like to play with.
          </span>
        </>
      ),
    },
    {
      question: "How do i make a withdrawal?",
      answer: (
        <>
          <span>
            If you have won a game you can withdraw the winnings directly from
            the ‘congratulations’ screen, or go to your profile page to the
            “Won”-tab to see all your withdrawable winnings.
          </span>
        </>
      ),
    },
    {
      question: "How long do deposits or withdrawals take?",
      answer: (
        <>
          <span>
            Deposits and withdrawals are instantly, we do not handle them
            manually and you do not need to wait, simply confirm the transaction
            with your wallet and wait for the transaction to confirm. (This
            takes just a few seconds)
          </span>
        </>
      ),
    },
    {
      question: "Are there any daily limits to deposits or withdrawals?",
      answer: (
        <>
          <span>
            There are currently no limits set to the amount of collectibles you
            can deposit or winnings you can withdraw, for any period.
          </span>
        </>
      ),
    },
    {
      question: "Are there any fees?",
      answer: (
        <>
          <span>
            We charge 0% fees for deposits and we only charge winners or early
            withdrawals with a fee of 4%. Don’t win or quit early? Don’t pay!
          </span>
        </>
      ),
    },
  ],
};
