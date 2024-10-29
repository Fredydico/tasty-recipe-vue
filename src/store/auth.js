import axios from "axios";
import cookies from "js-cookie";
export default {
  namespaced: true,
  state() {
    return {
      token: null,
      tokenExpirationDate: null,
      userLogin: {},
      isLogin: false,
    };
  },
  mutations: {
    setToken(state, { idToken, expiresIn }) {
      state.token = idToken;
      state.tokenExpirationDate = expiresIn;
      cookies.set("tokenExpirationDate", expiresIn);
      cookies.set("jwt", idToken);
    },
    setUserLogin(state, { userData, loginStatus }) {
      state.userLogin = userData;
      state.isLogin = loginStatus;
    },

    setUserLogout(state) {
      state.token = null;
      state.userLogin = {};
      state.isLogin = false;
      state.tokenExpirationDate = null;
      cookies.remove("jwt");
      cookies.remove("tokenExpirationDate");
      cookies.remove("UID");
    },
  },
  actions: {
    async getRegisterData({ commit, dispatch }, payload) {
      const APIkey = "AIzaSyAfvfFtWXpS5sESZE34BLqQIIiCwSKx0Xs";
      const authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

      try {
        console.log(payload);
        const { data } = await axios.post(authUrl + APIkey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        });
        commit("setToken", {
          idToken: data.idToken,
          expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        });
        const newUserData = {
          userId: data.localId,
          firstname: payload.firstname,
          lastname: payload.lastname,
          username: payload.username,
          email: payload.email,
          imageLink: payload.imageLink,
        };
        cookies.set("UID", newUserData.userId);
        await dispatch("addNewUser", newUserData);
      } catch (err) {
        console.log(err);
      }
    },
    async addNewUser({ commit, state }, payload) {
      try {
        const { data } = await axios.post(`https://vue-js-project-12e9d-default-rtdb.firebaseio.com/user.json?auth=${state.token}`, payload);
        commit("setUserLogin", { userData: payload, loginStatus: true });
      } catch (err) {
        console.log(err);
      }
    },

    async getLoginData({ commit, dispatch }, payload) {
      const APIkey = "AIzaSyAfvfFtWXpS5sESZE34BLqQIIiCwSKx0Xs";
      const authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
      try {
        const { data } = await axios.post(authUrl + APIkey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        });
        commit("setToken", {
          idToken: data.idToken,
          expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
        });
        await dispatch("getUserData", data.localId);
      } catch (err) {
        console.log(err);
      }
    },

    async getUserData({ commit }, payload) {
      try {
        const { data } = await axios.get(`https://vue-js-project-12e9d-default-rtdb.firebaseio.com/user.json`);
        for (let key in data) {
          if (data[key].userId === payload) {
            cookies.set("UID", data[key].userId);
            commit("setUserLogin", { userData: data[key], loginStatus: true });
          }
          console.log(data[key]);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
