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
  const commission = 0.05
  module.exports = {
    UserDataType,
    challengeCategories,
    challengeStatus,
    penalties,
    commission
  };
