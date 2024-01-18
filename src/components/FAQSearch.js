import React from "react";
import { Link } from "react-router-dom";

export default function FAQSearch({ searchTerm }) {
  const gettingStarted = [
    { question: "How do i create RaidWin account?", url: "getting-started" },
    { question: "How do i play my first game?", url: "getting-started" },
  ];

  const myAccount = [
    {
      question: "How do i change my profile picture, name or account details?",
      url: "Myaccount",
    },
    {
      question: "Can i link multiple Solana wallets to my account?",
      url: "Myaccount",
    },
    {
      question: "Is my account information shared with third parties?",
      url: "Myaccount",
    },
    {
      question: "Is there a minimum age requirement to create an account?",
      url: "Myaccount",
    },
    {
      question: "Is there an account verification process?",
      url: "Myaccount",
    },
    {
      question: "Can I link my social media accounts to my gaming profile?",
      url: "Myaccount",
    },
  ];

  const provablyFair = [
    {
      question:
        "How do i know the games are fair and not rigged or possible to cheat?",
      url: "prabablyfair",
    },
    {
      question: "What is Provably Fair?",
      url: "prabablyfair",
    },
  ];

  const depositeandwithdraw = [
    {
      question: "How do i make a deposit?",
      url: "deposits",
    },
    {
      question: "How do i make a withdrawal?",
      url: "deposits",
    },
    {
      question: "How long do deposits or withdrawals take?",
      url: "deposits",
    },
    {
      question: "Are there any daily limits to deposits or withdrawals?",
      url: "deposits",
    },
    {
      question: "Are there any fees?",
      url: "deposits",
    },
  ];

  const faqs = [
    { question: "What is RaidWin?", url: "faq" },
    { question: "What do i need to play", url: "faq" },
    {
      question:
        "How do I contact customer support for assistance or inquiries?",
      url: "faq",
    },
    {
      question: "Are there any restrictions on the number of bets I can place?",
      url: "faq",
    },
    {
      question:
        "Can I view my betting and gaming results from previous sessions?",
      url: "faq",
    },
    { question: "Can I cancel a bet after placing it?", url: "faq" },
  ];

  const filterData = (data, title) => {
    return data.filter((item) => {
      const compositeString = `${item.question.toLowerCase()} ${title.toLowerCase()}`;
      return compositeString.includes(searchTerm.toLowerCase());
    });
  };

  const filteredFaqs = filterData(faqs, "FAQs");
  const filteredGettingStarted = filterData(gettingStarted, "Getting Started");
  const filteredMyAccount = filterData(myAccount, "My Account");
  const filteredprovablyFair = filterData(provablyFair, "Provably Fair");
  const filtereddepositeandwithdraw = filterData(
    depositeandwithdraw,
    "Provably Fair"
  );

  if (!searchTerm) {
    return (
      <div className="w-full max-h-[40vh] overflow-auto">
        <Section title="FAQs" data={[faqs[0]]} />
        <Section title="Getting Started" data={[gettingStarted[0]]} />
        <Section title="My Account" data={[myAccount[0]]} />
        <Section title="Provably Fair" data={[provablyFair[0]]} />
        <Section
          title="Deposits & Withdrawals"
          data={[depositeandwithdraw[0]]}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-h-[40vh] overflow-auto">
      {filteredFaqs.length > 0 && <Section title="FAQs" data={filteredFaqs} />}
      {filteredGettingStarted.length > 0 && (
        <Section title="Getting Started" data={filteredGettingStarted} />
      )}
      {filteredMyAccount.length > 0 && (
        <Section title="My Account" data={filteredMyAccount} />
      )}
      {filteredprovablyFair.length > 0 && (
        <Section title="Provably Fair" data={filteredprovablyFair} />
      )}
      {filtereddepositeandwithdraw.length > 0 && (
        <Section
          title="Deposits & Withdrawals"
          data={filtereddepositeandwithdraw}
        />
      )}
    </div>
  );
}

const Section = ({ title, data }) => {
  return (
    <div className="px-4 py-2">
      <h2 className="mt-2">{title}</h2>
      {data.map((item, index) => (
        <Link to={`../${item.url}`} key={index}>
          <div className="p-3 mt-2 hover:bg-nouveau-main hover:bg-opacity-50 rounded-md">
            {item.question}
          </div>
        </Link>
      ))}
    </div>
  );
};
