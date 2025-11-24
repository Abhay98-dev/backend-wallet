import express from "express"
import {sql} from "../config/db.js"

const router=express.Router()

router.get("/:userId" ,async(req,res)=>{
    try{
        const {userId}=req.params
        const transaction=await sql`
        SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC
        `
        res.status(200).json(transaction)
    }catch(err){
        console.log("Error feteching transactions: ",err)
        res.status(500).json({message:"Internal server error"})
    }
})

router.post("/",async(req,res)=>{
    try{
        const{title,amount,category,user_id}=req.body
        if(!title || amount===undefined || !category || !user_id){
            return res.status(400).json({message:"All fields are required"})
        }

        const transaction=await sql`
        INSERT INTO transactions (user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *`

        console.log("Transaction created: ",transaction)
        res.status(201).json(transaction[0])


    }catch(err){
        console.error("Error creating transaction: ",err)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.delete("/:id",async(req,res)=>{
    try{
        const{id}=req.params

        if(isNaN(id)(paraseInt(id))){
            return res.status(400).json({message:"Invalid transaction ID"})
        }

        const result=await sql`
        DELETE FROM transactions WHERE id=${id} RETURNING *`

        if(result.length===0){
            return res.status(404).json({message:"Transaction not found"})
        }
        else if(result){
            res.status(200).json({message:"Transaction deleted successfully"})
        }
    }catch(err){
        console.error("Error deleting transaction: ",err)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get("/summary/:userId",async(req,res)=>{
    try{
        const {userId}=req.params
        const balanceResult=await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}
        `
        const incomeResult=await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${userId} AND amount>0`

        const expensesResult=await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id=${userId} AND amount<0`
        
        res.status(200).json({
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expenses:expensesResult[0].expenses
        })
    }catch(err){
        console.error("Error fetching summary: ",err)
        res.status(500).json({message:"Internal Server error"})
    }
})

export default router