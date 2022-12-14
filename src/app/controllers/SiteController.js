const DiaDiem = require('../models/DiaDiem');
const Tour = require('../models/Tour');
const TinTuc = require('../models/TinTuc');
const AmThuc = require('../models/AmThuc');
const Comment = require('../models/Comment');
const Statistical = require('../models/Statistical');
const { multipleMongooseToObject } = require('../../until/mongoose');
const { validationResult } = require('express-validator');
const passport = require('passport');

class SiteController {
    // [GET] /
    async index(req, res, next) {
        let tours = await Tour.find({}).limit(9).catch(next);
        let places = await DiaDiem.find({}).limit(9).catch(next); 
        let tintucs = await TinTuc.find({}).limit(9).catch(next); 
        let amthucs = await AmThuc.find({}).limit(9).catch(next); 
        let comments = await Comment.find({status: 'Nổi bật'}).catch(next); 
        let thongke = await Statistical.findOne({}).catch(next);
        let luottruycap = thongke.accessTimes;
        luottruycap = luottruycap +1;
        res.render('home', {
            title: 'Quảng bá du lịch và ẩm thực Thành phố Cần Thơ 😋',
            places: multipleMongooseToObject(places),
            tours: multipleMongooseToObject(tours),
            tintucs: multipleMongooseToObject(tintucs),
            amthucs: multipleMongooseToObject(amthucs),
            comments: multipleMongooseToObject(comments),
            luottruycap,
        });
    }

    // [GET] /search
    async search(req, res, next) {
        const key = req.body.search;

        function removeVietnameseTones(str) {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
            str = str.replace(/đ/g, 'd');
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
            str = str.replace(/Đ/g, 'D');

            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
            str = str.replace(/\u02C6|\u0306|\u031B/g, '');
            str = str.replace(/ + /g, ' ');
            str = str.trim();

            str = str.replace(
                /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
                ' '
            );
            return str;
        }
        const convertKey = removeVietnameseTones(key).toLowerCase();
        console.log(convertKey);
        // Tour
        let tour = await Tour.find({});
        const fillterTourByKey = (tours) => {
            return removeVietnameseTones(tours.name)
                .toLowerCase()
                .includes(convertKey.toLowerCase());
        };
        const tours = tour.filter(fillterTourByKey);

        // Tin Tuc
        let tintuc = await TinTuc.find({});
        const fillterTinTucByKey = (tintucs) => {
            return removeVietnameseTones(tintucs.title)
            .toLowerCase()
            .includes(convertKey.toLowerCase());
        };
        const tintucs = tintuc.filter(fillterTinTucByKey);

        // Dia Diem
        let diadiem = await DiaDiem.find({});
        const fillterDiaDiemByKey = (diadiems) => {
            return removeVietnameseTones(diadiems.name)
            .toLowerCase()
            .includes(convertKey.toLowerCase());
        };
        const fillterDiaDiemAddressByKey = (diadiems) => {
            return removeVietnameseTones(diadiems.address)
            .toLowerCase()
            .includes(convertKey.toLowerCase());
        };
        const diadiems = diadiem.filter(fillterDiaDiemByKey);
        const diadiemsAddress = diadiem.filter(fillterDiaDiemAddressByKey);

        // Am Thuc
        let amthuc = await AmThuc.find({});
        const fillterAmThucByKey = (amthucs) => {
            return removeVietnameseTones(amthucs.title)
            .toLowerCase()
            .includes(convertKey.toLowerCase());
        };
        const fillterAmThucAddressByKey = (amthucs) => {
            return removeVietnameseTones(amthucs.address)
            .toLowerCase()
            .includes(convertKey.toLowerCase());
        };
        let amthucs = amthuc.filter(fillterAmThucByKey);
        let amthucsAddress = amthuc.filter(fillterAmThucAddressByKey);

        res.render('search', {
            title: 'Quảng bá du lịch và ẩm thực Thành phố Cần Thơ 😋',
            tours: multipleMongooseToObject(tours),
            tintucs: multipleMongooseToObject(tintucs),
            diadiems: multipleMongooseToObject(diadiems),
            amthucs: multipleMongooseToObject(amthucs),
            diadiemsAddress: multipleMongooseToObject(diadiemsAddress),
            amthucsAddress: multipleMongooseToObject(amthucsAddress),
        });
    }

    // [GET] /error500
    error500(req, res){
        res.render('error500', {title: 'ERROR 500'});
    }

    // [GET] /error400
    error400(req, res){
        res.render('error400', {title: 'ERROR 400'});
    }

    // [GET] /lien-he
    lienHe(req, res){
        res.render('lienhe', {title: 'Liên Hệ'});
    }

    // [GET] /tien-ich
    tienIch(req, res){
        res.render('tienich/index', {title: 'Tiện Ích'});
    }

    // [GET] /tien-ich/:slug
    tienIchInfo(req, res){
        res.render('tienich/'+req.params.slug, {title: 'Liên hệ khẩn cấp!!!'});
    }

    // [PUT] /luottruycap/638a0806974ac6409444b67e
    async accessTimes(req, res, next) {
        let thongke = await Statistical.findOne({}).catch(next);
        let luottruycap = thongke.accessTimes;
        Statistical.updateOne({ _id: req.params.id}, {accessTimes: luottruycap+1})
            .then(() => res.redirect("back"))
            .catch(next);
    }


}

module.exports = new SiteController();
