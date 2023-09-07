

const UserDataType = {
    BASIC: "basic",
   ADMIN:"admin",
  };


  const challengeCategories ={
    POPULAR: "popular",
    QUICK: "quick",
    RICH: "rich"
  }
  const challengeStatus = {
    CREATED:'created',
    RUNNING: 'running',
    JUDGEMENT:'judgement', 
    COMPLETED:'completed',
    CANCELLED:'cancelled'
  }
  const penalties = {
    FRAUD: 100,
    WRONGUPDATE:50,
    NOUPDATE:50,

  }
  const permission ={
    block_user:"block_user",
  add_coins:"add_coins",
  withdraw_coins:"withdraw_coins",
  challenge_result:"challenge_result",
  settings:"settings",
  manage_admin:"manage_admin"
  }
  // const commission = parseFloat((await walletServices.getCommission()))
  module.exports = {
    UserDataType,
    challengeCategories,
    challengeStatus,
    penalties,
    permission,
    // commission
  };

  

