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
  module.exports = {
    UserDataType,
    challengeCategories,
    challengeStatus
  };