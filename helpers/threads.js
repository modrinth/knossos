export function addReportMessage(thread, report) {
  if (!thread || !report) {
    return thread
  }
  if (
    !thread.members.some((user) => {
      return user.id === report.reporter.id
    })
  ) {
    thread.members.push(report.reporter)
  }
  if (!thread.messages.some((message) => message.id === 'original')) {
    thread.messages.push({
      id: 'original',
      author_id: report.reporter.id,
      body: {
        type: 'text',
        body: report.body,
        private: false,
        replying_to: null,
      },
      created: report.created,
    })
  }
  return thread
}
