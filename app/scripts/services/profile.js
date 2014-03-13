'use strict';

angular.module('wearscriptPlaygroundApp')

  .factory( 'Profile', function($rootScope,$log){

    var profile = {
      authenticated: false,
      complete: false,
      github_user: false,
      google_user: false,
      glass_id: false,
      vim_mode: false
    }
    //local storage for vim boolean
    profile.vim_mode = localStorage.getItem("vim_mode");

    return profile

  })
