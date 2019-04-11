<template>
  <div class="d-body">
    <div class="d-top"></div>
    <div class="d-container">
      <img src="@/assets/img/logo.png" class="d-img">
      <div class="d-con animated bounceInLeft">hello world</div>
    </div>
  </div>
</template>

<script>
import 'animate.css'

export default {
  data() {
    return {
      form: {
        phone: '',
        password: ''
      },
      rules: { // 常规校验
        // type: [
        //   { required: true, type: 'number', message: '请选择规模', trigger: 'change' }
        // ],
        // comName: [
        //   { required: true, message: '请输入承运商名称', trigger: 'blur' },
        //   { max: 20, message: '最大输入20位', trigger: 'blur' }
        // ]
      }
    }
  },
  props: { // 组件属性
    // title: { type: String, default: '详情' },
    // visible: { type: Boolean, default: false }
  },
  computed: {
  },
  /** ***************************初始化 end*************************** **/
  /** *************************生命周期 start************************* **/
  mounted() {
    this.fetchDetail()
  },
  /** **************************生命周期 end************************** **/
  methods: {
    // -----增删改查 start-----
    fetchDetail() {
      const data = {
        comNo: '10021'
      }
      // TODO: 查询接口
      // console.log(this.$http)
      this.$http.post('/api/biz/client/findCompanyByComNo', data)
        .then(res => {
          // console.log(res)
          if (res.retCode === 0) {
            this.form = {
              ...this.form,
              ...res.data
            }
          } else {
            this.$message({
              message: res.errMsg,
              type: 'warning'
            })
          }
        })
    },
    save() {
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      // console.log(this.form)
      // TODO: 其他校验
      if (this.loading) return
      this.loading = true
      let apiUrl = '/api/biz/client/findCompanyByComNo'
      if (this.dataId) {
        apiUrl = '/api/biz/client/findCompanyByComNo'
      }
      // TODO: 保存接口
      this.$http.post(apiUrl, this.form)
        .then(res => {
          this.loading = false
          if (res.retCode === 0) {
            this.editStatus = false
            this.callback({
              reload: true,
              visible: false
            })
            this.$message({
              message: this.dataId ? '保存成功' : '新增成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.errMsg,
              type: 'warning'
            })
          }
        })
        // } else {
        //   console.log('error submit!!')
        //   return false
        // }
      // })
    }
    // -----增删改查 end-----
  }
  /** *************************methods end************************* **/
}
</script>

<style>
  .d-con {
    width: 7.5rem;
    height: 7.5rem;
  }
</style>
