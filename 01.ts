/* enum  枚举 */

enum Gender {
    Male = 1,
    Famale = 0
}

let i: { name: string, gender: Gender }

i = {
    name: '哈哈',
    gender: Gender.Male
}