<?php

namespace App\Http\Controllers;

use App\Services\Data;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = collect(Data::students());$genders = Data::genders();

        if ($request->filled('search')) {
            $search = strtolower($request->search);

            $students =$students->filter(function ($student) use ($search) {
                return str_contains(strtolower($student['name']),$search)
                    || str_contains(strtolower($student['email']),$search)
                    || str_contains(strtolower($student['class']),$search);
            });
        }

        if ($request->filled('gender')) {$students = $students->where('gender',$request->gender);
        }

        return view('pages.students.index', [
            'students' => $students->values(),
            'genders' => $genders,
            'search' => $request->search,
            'selectedGender' => $request->gender,
        ]);
    }

    public function create()
    {
        $genders = Data::genders();
        return view('pages.students.create', compact('genders'));
    }

    public function show(string $id)
    {
        $student = Data::findStudent((int)$id);

        abort_unless($student, 404, 'Student record could not be found within the registry database.');

        return view('pages.students.show', compact('student'));
    }
}