type AsyncFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>
type ErrorFunction = (err: unknown) => void | Promise<void>
type VoidFunction = () => void | Promise<void>

type useClientTry = <TArgs extends any[], TResult>(
  fn: AsyncFunction<TArgs, TResult>,
  onFail?: ErrorFunction,
  onFinish?: VoidFunction
) => (...args: TArgs) => Promise<TResult | undefined>

export const useClientTry: useClientTry =
  (fn, onFail, onFinish) =>
  async (...args) => {
    startLoading()
    try {
      const output = await fn(...args)
      return output
    } catch (err) {
      if (onFail) {
        await onFail(err)
      } else {
        console.error('[CLIENT TRY ERROR]', err)
      }
    } finally {
      if (onFinish) await onFinish()
      stopLoading()
    }
  }
