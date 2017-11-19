<template>
  <div class="wrap">
    <div class="login" v-if="showLogin">
      <div class="logo">Chat.<span>io</span>
        <div class="desc">simple chat</div>
      </div>
      <div class="form">
        <h2>Join us</h2>
        <label for="">Username</label>
          <input type="text" v-model="user" @keypress.enter="join">
          <button class="btn btn--success btn--full" @click="join">Join</button>
      </div>
    </div>
    <div v-else class="chat">
      <div class="top">
        <div class="buttons">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="body" ref="body">
        <div class="message" v-for="item in chat" :key="item.message">
          <strong>{{item.username}}: </strong>{{item.message}}
        </div>
      </div>
      <div class="send">
        <input type="text" v-model="message" @keypress.enter="sendMessage">
        <div class="send__message" @click="sendMessage">
          <i class="fa fa-paper-plane"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io.connect('http://localhost:3010')

export default {
  data () {
    return {
      user: null,
      message: null,
      chat: [],
      showLogin: true
    }
  },

  mounted () {
    socket.on('set initial messages', data => {
      this.chat = data
    })
    socket.on('new message', data => {
      this.chat = data
      if (!this.showLogin) {
        this.$nextTick(() => {
          this.setScrollToEnd()
        })
      }
    })
  },

  methods: {
    join () {
      socket.emit('join user', this.user)
      this.user = ''
      this.showLogin = false
      this.$nextTick(() => {
        this.setScrollToEnd()
      })
    },
    sendMessage () {
      socket.emit('send message', this.message)
      this.message = ''
    },
    setScrollToEnd () {
      this.$refs.body.scrollTop = this.$refs.body.scrollHeight
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,700');

html,
body {
  font-family: 'Roboto', Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 14px;
  margin: 0;
}
label {
  font-size: 12px;
  color: #ccc;
}
input {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
  display: inline-block;
  width: 100%;
  vertical-align: middle;
  padding: 5px 10px;
  font-size: 14px;
  outline: none;
}
.wrap {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}
.logo {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  span {
    color: limegreen;
  }
  .desc {
    font-size: 13px;
    color: #ccc;
  }
}
.form {
  padding: 40px 30px;
  width: 300px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  h2 {
    margin: 0 0 10px 0;
    text-align: center;
    font-weight: 300;
  }
}
.login {
  .btn {
    margin-top: 10px;
  }
}
.chat {
  width: 400px;
  height: 400px;
  border-radius: 3px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid #ddd;
  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background-color: #e8e8e8;
    .buttons {
      position: relative;
      top: 6px;
      left: 10px;
      span {
        margin-right: 2px;
        height: 10px;
        width: 10px;
        display: inline-block;
        border-radius: 100%;
        background-color: #db7067;
        &:nth-child(2) {
          background-color: #e4ba4f;
        }
        &:nth-child(3) {
          background-color: #64cb8c;
        }
      }
    }
  }
  .body {
    top: 45px;
    left: 10px;
    right: 10px;
    bottom: 100px;
    position: absolute;
    overflow-y: scroll;
    word-wrap: break-word;
  }
  .send {
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 10px;
    input {
      padding-right: 30px;
    }
    &__message {
      position: absolute;
      right: 20px;
      top: 17px;
      cursor: pointer;
      color: limegreen;
      &:hover {
        i {
          color: darken(limegreen, 5%);
        }
      }
    }
  }
}
.btn {
  padding: 0 15px;
  box-sizing: border-box;
  height: 30px;
  border: 1px solid transparent;
  border-radius: 3px;
  background-color: #eee;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #ccc;
  }
  &--full {
    width: 100%;
  }
  &--success {
    background-color: limegreen;
    color: #fff;
    &:hover {
      background-color: darken(limegreen, 5%);
    }
  }
}
</style>
