/*
 * @Author: Hongzhifeng
 * @Date: 2022-06-28 15:35:28
 * @LastEditors: Hongzhifeng
 * @LastEditTime: 2022-07-05 16:53:57
 * @Description: 
 */
export default function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}