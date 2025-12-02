/**
 * 格式化消息内容，处理角色标签和换行
 */
export function formatMessage(content) {
  return content
    .replace(/【([^】]+)】/g, '<div class="role-tag">【$1】</div>')
    .replace(/\n/g, '<br>')
    .replace(/(✅|📌|🎯)/g, '<span class="emoji">$1</span>')
}
