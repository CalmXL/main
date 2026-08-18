/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA DOC2TS                        ##
 * ##                                                           ##
 * ## AUTHOR: space-77                                          ##
 * ## SOURCE: https://github.com/space-77/doc2ts                ##
 * ---------------------------------------------------------------
 */

export namespace EnumLists {}

export namespace __common__ {
  export interface UtilsResponse {
    code?: number
    data?: any
    msg?: string
  }

  export interface ControllersChangeEmailRequestBody {
    email?: string
  }

  export interface ControllersUpdateNameRequestBody {
    name?: string
  }

  export interface ControllersChangePasswordRequestBody {
    newPassword?: string
    password?: string
  }
}

export namespace Certification {
  export interface PostLoginRes extends __common__.UtilsResponse {}

  export interface PostLoginParams {}

  export interface PostRegisterRes extends __common__.UtilsResponse {}

  export interface PostRegisterParams {}

  export type RPostLogin = Promise<[any, __common__.UtilsResponse['data'], __common__.UtilsResponse]>
  export type RPostRegister = Promise<[any, __common__.UtilsResponse['data'], __common__.UtilsResponse]>
}

export namespace UserManagement {
  export interface PatchEmailRes extends __common__.UtilsResponse {}

  export interface PatchEmailParams {}

  export interface PatchEmailBody extends __common__.ControllersChangeEmailRequestBody {}

  export interface PatchNameRes extends __common__.UtilsResponse {}

  export interface PatchNameParams {}

  export interface PatchNameBody extends __common__.ControllersUpdateNameRequestBody {}

  export interface PatchPasswordRes extends __common__.UtilsResponse {}

  export interface PatchPasswordParams {}

  export interface PatchPasswordBody extends __common__.ControllersChangePasswordRequestBody {}

  export type RPatchName = Promise<[any, __common__.UtilsResponse['data'], __common__.UtilsResponse]>
  export type RPatchEmail = Promise<[any, __common__.UtilsResponse['data'], __common__.UtilsResponse]>
  export type RPatchPassword = Promise<[any, __common__.UtilsResponse['data'], __common__.UtilsResponse]>
}
